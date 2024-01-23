import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";
import { Item } from "./item";

export type SortableItemProps = {
	id: number;
};

export const SortableItem: FC<SortableItemProps> = (props) => {
	const { id } = props;
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div style={{ ...style }} {...attributes} {...listeners}>
			<Item ref={setNodeRef} id={id} />
		</div>
	);
};
