import { ValueObject } from '../core/value-object';
import { InvalidMoneyValueError } from '../errors/invalid-money-value-error';

interface MoneyProps {
  value: number;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static create(value: number): Money {
    if (value === null || value === undefined) {
      throw new InvalidMoneyValueError('Value must not be null or undefined.');
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new InvalidMoneyValueError('Value must be a valid number.');
    }

    if (value <= 0) {
      throw new InvalidMoneyValueError('Value must be greater than zero.');
    }

    const rounded = Math.round(value * 100) / 100;

    return new Money({ value: rounded });
  }

  get value(): number {
    return this.props.value;
  }

  add(other: Money): Money {
    return Money.create(this.props.value + other.value);
  }

  subtract(other: Money): Money {
    return Money.create(this.props.value - other.value);
  }

  multiply(factor: number): Money {
    return Money.create(this.props.value * factor);
  }

  isGreaterThan(other: Money): boolean {
    return this.props.value > other.value;
  }

  isLessThan(other: Money): boolean {
    return this.props.value < other.value;
  }

  equals(other: Money): boolean {
    return this.props.value === other.value;
  }

  toFixed(): string {
    return this.props.value.toFixed(2);
  }

  toString(): string {
    return `R$ ${this.toFixed()}`;
  }
}
