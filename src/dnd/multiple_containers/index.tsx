import {
    Active,
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    MeasuringStrategy,
    UniqueIdentifier,
    closestCenter,
    defaultDropAnimationSideEffects,
    getFirstCollision,
    pointerWithin,
    rectIntersection,
} from "@dnd-kit/core";
import { DroppableContainer, RectMap } from "@dnd-kit/core/dist/store";
import { ClientRect, Coordinates } from "@dnd-kit/core/dist/types";
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRange } from "../lib/createRange";
import { Item } from "../lib/item";
import { SortableItem } from "../lib/sortable_item";
import { DroppableContainer as DroppableContainerElement } from "./droppable_container";

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: "0.5",
			},
		},
	}),
};

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
    const lastOverId = useRef<UniqueIdentifier | null>(null);

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

    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args:{
            active: Active;
            collisionRect: ClientRect;
            droppableRects: RectMap;
            droppableContainers: DroppableContainer[];
            pointerCoordinates: Coordinates | null;
        }) => {
          if (activeId && activeId in items) {
            return closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id in items
              ),
            });
          }
    
          // Start by finding any intersecting droppable
          const pointerIntersections = pointerWithin(args);
          const intersections =
            pointerIntersections.length > 0
              ? // If there are droppables intersecting with the pointer, return those
                pointerIntersections
              : rectIntersection(args);
          let overId = getFirstCollision(intersections, 'id');
    
          if (overId != null) {
           
    
            if (overId in items) {
              const containerItems = items[overId];
    
              // If a container is matched and it contains items (columns 'A', 'B', 'C')
              if (containerItems.length > 0) {
                // Return the closest droppable within that container
                overId = closestCenter({
                  ...args,
                  droppableContainers: args.droppableContainers.filter(
                    (container) =>
                      container.id !== overId &&
                      containerItems.includes(container.id)
                  ),
                })[0]?.id;
              }
            }
    
            lastOverId.current = overId;
    
            return [{id: overId}];
          }
    
          // When a draggable item moves to a new container, the layout may shift
          // and the `overId` may become `null`. We manually set the cached `lastOverId`
          // to the id of the draggable item that was moved to the new container, otherwise
          // the previous `overId` will be returned which can cause items to incorrectly shift positions
          if (recentlyMovedToNewContainer.current) {
            lastOverId.current = activeId;
          }
    
          // If no droppable is matched, return the last match
          return lastOverId.current ? [{id: lastOverId.current}] : [];
        },
        [activeId, items]
      );

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

    useEffect(() => {
        requestAnimationFrame(() => {
          recentlyMovedToNewContainer.current = false;
        });
      }, [items]);

	return (
		<DndContext
			measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            collisionDetection={collisionDetectionStrategy}
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
						<DroppableContainerElement
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
						</DroppableContainerElement>
					))}
				</SortableContext>
			</div>
			{createPortal(
				<DragOverlay dropAnimation={dropAnimation}>
					{activeId ? (
						containers.includes(activeId) ? (
							<div>container</div>
						) : (
							<Item id={activeId as number} />
						)
					) : null}
				</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);
};
