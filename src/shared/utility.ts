export const updateObject = (oldObject: {} | [] | null, updatedProperties: {} | [] | null) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};
