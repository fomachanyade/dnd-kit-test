import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';


export const  Droppable = (props:{children:ReactNode})=>  {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}