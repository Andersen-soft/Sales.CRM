package com.andersenlab.crm.utils;


import java.io.File;

public class CrmFileUtils {
    private CrmFileUtils() {
    }

    public static String getExtension(String filename) {
        try {
            return filename.substring(filename.lastIndexOf('.'));
        } catch (StringIndexOutOfBoundsException e) {
            throw new IllegalArgumentException("Некорректное название файла: " + filename, e);
        }
    }

    public static String replaceAllFileSeparator(String fileName) {
        if ("\\".equals(File.separator)) {
            return fileName.replace('/', File.separatorChar);
        } else {
            return fileName.replace('\\', File.separatorChar);
        }
    }
}
