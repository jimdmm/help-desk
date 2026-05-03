// domain/value-objects/availability.vo.ts

import { ValueObject } from "../core/value-object"

interface AvailabilityProps {
  schedules: string[]
}

export class Availability extends ValueObject<AvailabilityProps> {
  private static readonly VALID_SCHEDULES = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00',
  ]

  private static readonly TIME_REGEX = /^([01]\d|2[0-3]):00$/

  private constructor(props: AvailabilityProps) {
    super(props)
  }

  static create(slots: string[]): Availability {
    if (!slots || slots.length === 0) {
      throw new Error('There should be a set schedule')
    }

    for (const slot of slots) {
      if (!this.TIME_REGEX.test(slot)) {
        throw new Error(`Invalid format: "${slot}". Use HH:00.`)
      }

      if (!this.VALID_SCHEDULES.includes(slot)) {
        throw new Error(`Time slot out of allowed range: "${slot}".`)
      }
    }

    const unique = [...new Set(slots)].sort()

    return new Availability({ schedules: unique })
  }

  static createDefault(): Availability {
    return new Availability({
      schedules: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    })
  }

  get schedules(): string[] {
    return this.props.schedules
  }

  hasSchedule(schedule: string): boolean {
    return this.props.schedules.includes(schedule)
  }
}