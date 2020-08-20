package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Comment;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.response.CommentResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@SuppressWarnings("unchecked")
public class CommentToCommentResponseConverterTest {

    private ConversionService conversionService = mock(ConversionService.class);
    private CommentToCommentResponseConverter converter = new CommentToCommentResponseConverter(conversionService) {
        @Override
        public Class getSource() {
            return null;
        }
    };

    @Test
    public void testConvert() {
        LocalDateTime createDate = LocalDateTime.of(2018, 9, 9, 10, 10, 10);
        LocalDateTime editDate = LocalDateTime.of(2018, 10, 10, 11, 11, 11);
        Employee employee = new Employee();
        EmployeeSample employeeSample = new EmployeeSample();
        Comment source = new Comment();
        source.setId(1L);
        source.setIsEdited(true);
        source.setEmployee(employee);
        source.setDescription("Converter testing comment description");
        source.setCreateDate(createDate);
        source.setEditDate(editDate);

        given(conversionService.convert(employee, EmployeeSample.class)).willReturn(employeeSample);

        CommentResponse result = converter.convert(source);

        assertEquals(source.getId(), result.getId());
        assertEquals(employeeSample, result.getEmployee());
        assertEquals(source.getId(), result.getId());
        assertEquals(source.getIsEdited(), result.getIsEdited());
        assertEquals(source.getCreateDate(), result.getCreateDate());
        assertEquals(source.getDescription(), result.getDescription());
    }

    @Test
    public void testGetTarget() {
        Class<CommentResponse> expectedResult = CommentResponse.class;

        Class<CommentResponse> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}