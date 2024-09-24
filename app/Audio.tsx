import React, { forwardRef, useEffect, useState } from 'react';
import { Button, View, Image, TouchableOpacity, Text } from 'react-native'; // Import TouchableOpacity and Text
import TrackPlayer, { useTrackPlayerEvents, Event, useProgress } from 'react-native-track-player'; // Import Event type
import { StyleSheet } from 'react-native'; // Import StyleSheet
import Slider from '@react-native-community/slider';
import Swiper from 'react-native-deck-swiper';

interface AudioPlayerProps {
    title: string;
    artist: string;
    id: number;
    swiperRef: React.MutableRefObject<Swiper<any> | null>
   
}

const API_BASE_URL = 'http://95.176.226.180:3000'; // Replace with your machine's IP

const AudioPlayer = forwardRef(({title, artist, id, swiperRef }: AudioPlayerProps, ref,) => {

    const { position, buffered, duration } = useProgress()

    const seekTo  = async (position1:number) => {
        await TrackPlayer.seekTo(position1*duration);
    }

    useEffect(() => {

        const setupPlayer = async () => {
            try {

                const index = await TrackPlayer.getActiveTrackIndex()
                
                
            }
            catch (error) {
                await TrackPlayer.setupPlayer();
            }
            await TrackPlayer.add({
                id: 1, // Ensure 'trackId' is a valid string
                url: `${API_BASE_URL}/api/getSong/${id}`,
                title: title,
                artist: artist,

            });

            
        };
        setupPlayer();


        return () => {
            TrackPlayer.reset(); // Clean up the player on unmount
        };
    }, [id]);

    const play = async () => {
        await TrackPlayer.play();
    };

    // Expose playAudio method
    React.useImperativeHandle(ref, () => ({

        playAudio: async (title: string, artist: string, id: number) => {
            await TrackPlayer.reset();
            console.log("Resetting player");
            await TrackPlayer.add({ id: 1, url: `${API_BASE_URL}/api/getSong/${id}`, title, artist });
            await TrackPlayer.play();
        },
        pauseAudio: async () => {
            await TrackPlayer.pause();
        },
        getDuration: async () => {
            return duration
           
        },
        getCurrentPosition: async () => {
            return position
        },
        seekTo: async (position: number) => {
            await TrackPlayer.seekTo(position*duration);
        },
    }));

    // Handling events
    const events: Array<Event> = [
        Event.PlaybackActiveTrackChanged,
        Event.PlayerError,
        Event.PlaybackState,
    ]; // Use string literals directly

    useTrackPlayerEvents(events, (event) => {
        switch (event.type) {
            case 'playback-state':
                console.log('Playback state changed:', event.state);
                if (event.state == "ended"){
                    if (swiperRef.current != null){
                        swiperRef.current.swipeRight()
                    }
                    

                }
                    
                break;
            case 'playback-error':
                console.error('Playback error:', event.message);
                break;
            case 'playback-track-changed':
                console.log('Track changed:', event.nextTrack);
                break;
            default:
                break;
        }
    });


    return (
        
        <View >
            <View style={styles.buttonContainer}>
                <Text>{Math.floor(position)} : {Math.floor(duration)}</Text>
            </View>
            
            
           <View style={styles.buttonContainer}>

            
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={position/duration}
                onValueChange={seekTo}
              />
           
        </View>
        </View>
        
    );
});

// Don't forget to set the display name for better debugging
AudioPlayer.displayName = 'AudioPlayer';

const styles = StyleSheet.create({ // Add styles
    buttonContainer: {
        flexDirection: 'row', // Align buttons in a row
        justifyContent: 'space-around', // Space buttons evenly
        margin: 10,
    },
    button: {
        borderRadius: 20, // Make buttons round
        padding: 10,
        backgroundColor: '#007BFF', // Button color
        color: '#FFFFFF', // Text color
    },
});

export default AudioPlayer;
