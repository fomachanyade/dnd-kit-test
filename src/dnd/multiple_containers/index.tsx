import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	UniqueIdentifier,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRef, useState } from "react";
import { createRange } from "../lib/createRange";
import { Item } from "../lib/item";
import { SortableItem } from "../lib/sortable_item";
import { DroppableContainer } from "./droppable_container";

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

export const MultipleContainers = () => {
	const itemCount = 5;
	const [items, setItems] = useState<Items>({
		A: createRange(itemCount, (index) => `A${index + 1}`),
		B: createRange(itemCount, (index) => `B${index + 1}`),
		C: createRange(itemCount, (index) => `C${index + 1}`),
		D: createRange(itemCount, (index) => `D${index + 1}`),
	});
	const [clonedItems, setClonedItems] = useState<Items | null>(null);
	const [containers, setContainers] = useState(
		Object.keys(items) as UniqueIdentifier[],
	);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const recentlyMovedToNewContainer = useRef(false);

	const findContainer = (id: UniqueIdentifier) => {
		if (id in items) {
			return id;
		}

		return Object.keys(items).find((key) => items[key].includes(id));
	};

	const getIndex = (id: UniqueIdentifier) => {
		const container = findContainer(id);

		if (!container) {
			return -1;
		}

		const index = items[container].indexOf(id);

		return index;
	};

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;

		setActiveId(active.id);
		setClonedItems(items);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		const overId = over?.id;

		// containerの場合はスキップ
		if (overId == null || active.id in items) {
			return;
		}

		const overContainer = findContainer(overId);
		const activeContainer = findContainer(active.id);
		if (!overContainer || !activeContainer) {
			return;
		}
		if (activeContainer !== overContainer) {
			setItems((items) => {
				const activeItems = items[activeContainer];
				const overItems = items[overContainer];
				const overIndex = overItems.indexOf(overId);
				const activeIndex = activeItems.indexOf(active.id);

				let newIndex: number;

				if (overId in items) {
					newIndex = overItems.length + 1;
				} else {
					const isBelowOverItem =
						over &&
						active.rect.current.translated &&
						active.rect.current.translated.top >
							over.rect.top + over.rect.height;

					const modifier = isBelowOverItem ? 1 : 0;

					newIndex =
						overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
				}

				recentlyMovedToNewContainer.current = true;

				return {
					...items,
					[activeContainer]: items[activeContainer].filter(
						(item) => item !== active.id,
					),
					[overContainer]: [
						...items[overContainer].slice(0, newIndex),
						items[activeContainer][activeIndex],
						...items[overContainer].slice(
							newIndex,
							items[overContainer].length,
						),
					],
				};
			});
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id in items && over?.id) {
			setContainers((containers) => {
				const activeIndex = containers.indexOf(active.id);
				const overIndex = containers.indexOf(over.id);

				return arrayMove(containers, activeIndex, overIndex);
			});
		}

		const activeContainer = findContainer(active.id);

		if (!activeContainer) {
			setActiveId(null);
			return;
		}

		const overId = over?.id;

		if (overId == null) {
			setActiveId(null);
			return;
		}

		const overContainer = findContainer(overId);
		if (overContainer) {
			const activeIndex = items[activeContainer].indexOf(active.id);
			const overIndex = items[overContainer].indexOf(overId);

			if (activeIndex !== overIndex) {
				setItems((items) => ({
					...items,
					[overContainer]: arrayMove(
						items[overContainer],
						activeIndex,
						overIndex,
					),
				}));
			}
		}

		setActiveId(null);
	};

	const handleDragCancel = () => {
		if (clonedItems) {
			setItems(clonedItems);
		}
		setActiveId(null);
		setClonedItems(null);
	};

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<div
				style={{
					display: "inline-grid",
					boxSizing: "border-box",
					padding: 20,
					gridAutoFlow: "column",
				}}
			>
				<SortableContext
					items={[...containers]}
					strategy={horizontalListSortingStrategy}
				>
					{containers.map((containerId) => (
						<DroppableContainer
							id={containerId}
							items={items[containerId]}
							key={containerId}
							style={{
								display: "inline-grid",
								boxSizing: "border-box",
								padding: 20,
								gridAutoFlow: "row",
							}}
						>
							<SortableContext
								items={items[containerId]}
								strategy={verticalListSortingStrategy}
							>
								{items[containerId].map((value, index) => {
									return <SortableItem id={value as number} />;
								})}
							</SortableContext>
						</DroppableContainer>
					))}
				</SortableContext>
			</div>
			<DragOverlay>
				{activeId ? <Item id={activeId as number} /> : null}
			</DragOverlay>
		</DndContext>
	);
};
