/* eslint-disable eqeqeq */
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import { SortableItem } from "./sortable_item";

export const Sortable = () => {
	const [items, setItems] = useState([1, 2, 3]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((id) => id === active.id);
				const newIndex = items.findIndex((id) => id === over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items.map((id) => (
					<SortableItem key={id} id={id} />
				))}
			</SortableContext>
		</DndContext>
	);
};
