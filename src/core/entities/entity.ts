import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<Props> {
    private entityId: UniqueEntityId
    protected props: Props

    get id() {
        return this.entityId
    }

    protected constructor(props: Props, id?: UniqueEntityId) {
        this.props = props
        this.entityId = id ?? new UniqueEntityId()
    }
}
