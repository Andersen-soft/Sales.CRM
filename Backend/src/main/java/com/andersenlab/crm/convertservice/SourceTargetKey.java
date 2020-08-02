package com.andersenlab.crm.convertservice;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Objects;

/**
 * Class, used for mapping converters in ConverterRegistry.
 *
 * @see ConverterRegistry
 */
@AllArgsConstructor
@Getter
public final class SourceTargetKey {
    /**
     * The runtime class of converted objects.
     */
    private final Class source;
    /**
     * The runtime class of obtained as a result of conversion object
     */
    private final Class target;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        SourceTargetKey that = (SourceTargetKey) o;
        return Objects.equals(source, that.source) &&
                Objects.equals(target, that.target);
    }

    @Override
    public int hashCode() {
        return Objects.hash(source, target);
    }
}
