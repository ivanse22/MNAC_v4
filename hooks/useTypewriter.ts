
import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 20) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < text.length - 1) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setDisplayedText(text);
        setIsTyping(false);
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return { displayedText, isTyping };
};
