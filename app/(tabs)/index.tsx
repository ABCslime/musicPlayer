import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AudioPlayer from '../Audio';

class Card {
  artist: string;
  song: string;
  id: number;
  constructor(artist: string, song: string, url: string, id: number) {
    this.artist = artist;
    this.song = song;
    this.id = id;
  }
}

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  const API_BASE_URL = 'http://95.176.226.180:3000';
 

  const fetchArtistData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/getMetadata`);
      const data = await response.json();
      console.log(cards)
      setCards([...cards, { artist: data.artist, song: data.title, id: data.id }]);
      console.log(cards)
    } catch (error) {
      console.error('Error fetching artist data:', error);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, []);

  const audioPlayerRef = useRef<{
    playAudio: (title: string, artist: string, id: number) => Promise<void>;
    pauseAudio: () => Promise<void>;
    getCurrentPosition: () => Promise<number>;
    seekTo: (position: number) => Promise<void>;
    getDuration: () => Promise<number>;
  } | null>(null);


  const play = async () => {
    if (audioPlayerRef.current) {
      const currentCard = cards[currentIndex];
      await audioPlayerRef.current.playAudio(currentCard.song, currentCard.artist, currentCard.id);

      

     
    }
  };

  const pause = async () => {
    if (audioPlayerRef.current) {
      await audioPlayerRef.current.pauseAudio();
      
    }
  };

  const swiperRef = useRef<Swiper<any> | null>(null);

  const likeSong = async (songId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/likeSong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song_id: songId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Song marked as liked
      } else {
        console.error('Error liking the song:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={cards}
        infinite={true}
        renderCard={(cardData) => {
          if (!cardData) return null;
          const { artist, song, id } = cardData;
          return (
            <View style={styles.card}>
              <Text style={styles.text}>{`${artist} - ${song}`}</Text>
              <AudioPlayer
                ref={audioPlayerRef}
                id={id}
                title={song}
                artist={artist}
                swiperRef={swiperRef}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={play} style={styles.button}>
                  <Text style={{ color: '#FFFFFF' }}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => likeSong(id)} style={styles.button}>
                  <Text style={{ color: '#FFFFFF' }}>Like</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={pause} style={styles.button}>
                  <Text style={{ color: '#FFFFFF' }}>Pause</Text>
                </TouchableOpacity>

                
              </View>
            </View>
          );
        }}
        onSwiped={(cardIndex) => {
          setCurrentIndex(cardIndex + 1);
          fetchArtistData().then(()=> {
            if (audioPlayerRef.current) {
              audioPlayerRef.current.playAudio(cards[cardIndex+1].artist, cards[cardIndex+1].song, cards[cardIndex+1].id);
            }}
          );

          console.log(cards.length,cardIndex)
          
        }}
        onSwipedAll={() => {
          setCurrentIndex(0);
          fetchArtistData();
        }}
        cardIndex={currentIndex}
        backgroundColor={'#4FD0E9'}
        stackSize={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
  }
});
