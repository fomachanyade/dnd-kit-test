import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "./draggable";
import { Droppable } from "./droppable";

export const Simple = () => {
	const containers = ["A", "B", "C"];
	const [parent, setParent] = useState<UniqueIdentifier | null>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event;
		setParent(over ? over.id : null);
	};

	const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

	return (
		<DndContext onDragEnd={handleDragEnd}>
			{parent === null ? draggableMarkup : null}

			{containers.map((id) => (
				<Droppable key={id} id={id}>
					{parent === id ? draggableMarkup : "Drop here"}
				</Droppable>
			))}
		</DndContext>
	);
};
