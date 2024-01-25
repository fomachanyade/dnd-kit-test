import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC, useEffect, useState } from "react";
import { Item } from "./item";

export type SortableItemProps = {
	containerId: UniqueIdentifier;
	id: UniqueIdentifier;
};

function useMountStatus() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setIsMounted(true), 500);

		return () => clearTimeout(timeout);
	}, []);

	return isMounted;
}

export const SortableItem: FC<SortableItemProps> = (props) => {
	const { containerId, id } = props;

	const {
		attributes,
		setNodeRef,
		setActivatorNodeRef,
		listeners,
		isDragging,
		isSorting,
		over,
		overIndex,
		transform,
		transition,
	} = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const mounted = useMountStatus();
	const mountedWhileDragging = isDragging && !mounted;

	return (
		<div style={style} {...attributes} {...listeners}>
		<Item
			ref={setNodeRef}
			value={id}
			transition={transition}
			transform={transform}
			fadeIn={mountedWhileDragging}
			listeners={listeners}
		/>
		</div>
	);
};
