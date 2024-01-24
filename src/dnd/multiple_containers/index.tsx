import { DndContext } from "@dnd-kit/core";
import {
	SortableContext,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DroppableContainer } from "../sortable/droppable_container";

export const MultipleContainers = () => {
	const containers = [1, 2, 3, 4];
	const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return (
		<DndContext>
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
					{containers.map((id) => (
						<DroppableContainer
							id={id}
							items={items}
							key={id}
							style={{
								display: "inline-grid",
								boxSizing: "border-box",
								padding: 20,
								gridAutoFlow: "row",
							}}
						>
							droppable
						</DroppableContainer>
					))}
				</SortableContext>
			</div>
		</DndContext>
	);
};
