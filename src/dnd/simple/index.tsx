import { DndContext } from '@dnd-kit/core';
import { Draggable } from './draggable';
import { Droppable } from './droppable';

export const Simple = () => {
    return (
        <DndContext>
            <Draggable>Drag me</Draggable>
            <Droppable>Drop here</Droppable>
        </DndContext>
    );
};