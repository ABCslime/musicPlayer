import { Text, type TextProps, StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};




export const ThemedText = ({ style, lightColor, darkColor, type, ...otherProps }: ThemedTextProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textStyle = [styles[type || 'default'], { color }, style];

  return <Text style={textStyle} {...otherProps} />;
};

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  themedView: {
    flex: 1,
    backgroundColor: '#4FD0E9',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#4FD0E9',
  },
});