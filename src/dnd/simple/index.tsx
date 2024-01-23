import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "./draggable";
import { Droppable } from "./droppable";

export const Simple = () => {
	const [isDropped, setIsDropped] = useState(false);

	const handleDragEnd = (event: DragEndEvent) => {
		if (event.over && event.over.id === "droppable") {
			setIsDropped(true);
		}
	};
	return (
		<DndContext onDragEnd={handleDragEnd}>
			<Draggable>Drag me</Draggable>
			<Droppable>Drop here</Droppable>
		</DndContext>
	);
};
