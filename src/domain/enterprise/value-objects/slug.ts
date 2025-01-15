export class Slug {
    value: string

    private constructor(value: string) {
        this.value = value
    }

    static create(value: string) {
        return new Slug(value)
    }

    static createSlug(text: string): Slug {
        return new Slug(
            text
                .normalize('NFD')
                .toLowerCase()
                .trim()
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-'),
        )
    }
}
