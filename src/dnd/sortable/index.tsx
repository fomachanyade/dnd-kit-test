/* eslint-disable eqeqeq */
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
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

import { Item } from "./item";
import { SortableItem } from "./sortable_item";

export const Sortable = () => {
	const [activeId, setActiveId] = useState<number | null>(null);
	const [items, setItems] = useState([1, 2, 3, 4, 5]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;

		setActiveId(active.id as number);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveId(null);

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
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items.map((id) => (
					<SortableItem key={id} id={id} />
				))}
			</SortableContext>
			<DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
		</DndContext>
	);
};
