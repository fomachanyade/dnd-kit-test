import { DndContext, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
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
	const [containers, setContainers] = useState(
		Object.keys(items) as UniqueIdentifier[],
	);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

	return (
		<DndContext
        onDragStart={({active}) => {
            setActiveId(active.id);
          }}
          onDragEnd={({active})=>{
            setActiveId(null);
          }}>
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
            <DragOverlay>{activeId ? <Item id={activeId as number} /> : null}</DragOverlay>

		</DndContext>
	);
};
