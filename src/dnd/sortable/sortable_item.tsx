import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";

export type SortableItemProps = {
	id: number;
	children?: React.ReactNode;
};

export const SortableItem: FC<SortableItemProps> = (props) => {
	const { id, children } = props;
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children ? children : <div style={{ margin: "10px 0" }}>Item {id}</div>}
		</div>
	);
};
