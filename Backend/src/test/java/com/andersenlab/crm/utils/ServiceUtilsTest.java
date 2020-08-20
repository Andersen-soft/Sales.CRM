package com.andersenlab.crm.utils;

import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.junit.Test;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Supplier;

import static com.andersenlab.crm.utils.ServiceUtilsTest.StringTest.ONE;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ServiceUtilsTest {

    private static final String CONDITION = "testCondition";

    @AllArgsConstructor
    @Getter
    enum StringTest implements Nameable
    {
        ONE("one"),
        TWO("two"),
        THREE("three");
        private final String name;
    }

    @Test
    public void whenGetStringConditionWithoutIgnoreCaseAndGetCondition() {
        Supplier<String> filtered = () -> new String(CONDITION);
        boolean ignoreCase = false;
        boolean expectedResult =  true;

        boolean result = ServiceUtils.getStringCondition(filtered, CONDITION, ignoreCase);

        assertEquals(expectedResult, result);
    }

    @Test
    public void whenGetStringConditionWithIgnoreCaseAndGetCondition() {
        Supplier<String> filtered = () -> new String(CONDITION);
        boolean ignoreCase = true;
        boolean expectedResult =  true;

        boolean result = ServiceUtils.getStringCondition(filtered, CONDITION, ignoreCase);

        assertEquals(expectedResult, result);
    }

    @Test
    public void whenGetStringConditionWithoutIgnoreCaseAndGetNull() {
        String condition = null;
        Supplier<String> filtered = () -> new String(condition);
        boolean ignoreCase = false;
        boolean expectedResult =  true;

        boolean result = ServiceUtils.getStringCondition(filtered, condition, ignoreCase);

        assertEquals(expectedResult, result);
    }

    @Test
    public void whenGetStringConditionWithIgnoreCaseAndGetNull() {
        String condition = null;
        Supplier<String> filtered = () -> new String(condition);
        boolean ignoreCase = true;
        boolean expectedResult =  true;

        boolean result = ServiceUtils.getStringCondition(filtered, condition, ignoreCase);

        assertEquals(expectedResult, result);
    }

    @Test
    public void whenAssignFavoriteAndAddFavorite() {
        boolean isFavorite = true;
        List<Integer> favorites = new LinkedList<>(Arrays.asList(1, 2, 3));
        Integer favorite = 0;

        ServiceUtils.assignFavorite(favorites, favorite, isFavorite);
        assertEquals( true , favorites.contains(favorite));
    }

    @Test
    public void whenAssignFavoriteAndDeleteFavorite() {
        boolean isFavorite = false;
        List<Integer> favorites = new LinkedList<>(Arrays.asList(1, 2, 3));
        Integer favorite = 3;

        ServiceUtils.assignFavorite(favorites, favorite, isFavorite);
        assertEquals(false, favorites.contains(favorite));
    }

    @Test
    public void getByNameAndThenOk() {
        String test = "one";

        StringTest result = ServiceUtils.getByNameOrThrow(StringTest.class, test);
        assertEquals(ONE, result);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void getByNameAndThenResourceNotFoundException() {
        String line = new String();

        ServiceUtils.getByNameOrThrow(StringTest.class, line);
    }

    @Test
    public void getEnumNameAndThenReturnList() {
        String[] expected = {"one", "two", "three"};
        List<String> list = ServiceUtils.getEnumNames(StringTest.class);

        assertNotNull(list);
        assertEquals(expected.length , list.size());
    }
}
