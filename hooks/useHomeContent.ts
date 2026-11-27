
import { useMemo } from 'react';
import { UserRole, HomeContentConfig } from '../types';
import { STUDENT_HOME_CONTENT, TEACHER_HOME_CONTENT, VISITOR_HOME_CONTENT } from '../data/homeContent';

export const useHomeContent = (role: UserRole) => {
  
  const content: HomeContentConfig = useMemo(() => {
    if (role === 'teacher') {
      return TEACHER_HOME_CONTENT;
    }
    if (role === 'visitor') {
      return VISITOR_HOME_CONTENT;
    }
    return STUDENT_HOME_CONTENT;
  }, [role]);

  // Aquí podríamos añadir lógica asíncrona en el futuro (ej. fetch de noticias del CMS)
  // Por ahora es síncrono e instantáneo.

  return { content };
};
