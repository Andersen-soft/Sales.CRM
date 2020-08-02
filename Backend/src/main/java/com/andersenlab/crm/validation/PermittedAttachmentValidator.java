package com.andersenlab.crm.validation;

import com.andersenlab.crm.rest.MimeTypes;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Optional.ofNullable;

public class PermittedAttachmentValidator implements ConstraintValidator<PermittedAttachment, MultipartFile> {
    @Override
    public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext context) {
        return ofNullable(multipartFile).map(mf -> Stream.of(MimeTypes.MIME_IMAGE_JPEG,
                MimeTypes.MIME_IMAGE_PNG,
                MimeTypes.MIME_IMAGE_GIF,
                MimeTypes.MIME_TEXT_PLAIN,
                MimeTypes.MIME_APPLICATION_MSWORD,
                MimeTypes.MIME_APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT,
                MimeTypes.MIME_APPLICATION_PDF,
                MimeTypes.MIME_APPLICATION_VND_MSEXCEL,
                MimeTypes.MIME_APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET,
                MimeTypes.MIME_APPLICATION_VND_MSPOWERPOINT,
                MimeTypes.MIME_APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION,
                MimeTypes.MIME_APPLICATION_VND_OASIS_OPENDOCUMENT_TEXT,
                MimeTypes.MIME_APPLICATION_VND_OASIS_OPENDOCUMENT_SPREADSHEET,
                MimeTypes.MIME_APPLICATION_VND_OASIS_OPENDOCUMENT_GRAPHICS,
                MimeTypes.MIME_APPLICATION_VND_OASIS_OPENDOCUMENT_PRESENTATION)
                .collect(Collectors.toSet()).contains(mf.getContentType()))
                .orElse(true);
    }
}
