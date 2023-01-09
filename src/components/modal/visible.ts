const defaultVisible = {
    'signaling': false,
    'controlling': false,
    'license': false
};

export type Visible = typeof defaultVisible;
export type VisibleState = React.Dispatch<React.SetStateAction<Visible>>;

export { defaultVisible };
