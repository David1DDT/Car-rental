export const omit = <T extends Record<string, any>>(object: T, filters: (keyof T)[]): Partial<T> => {
    const obj = Object.fromEntries(
        Object.entries(object).filter(([key]) => !filters.includes(key as keyof T))
    )
    return obj as Partial<T>
}