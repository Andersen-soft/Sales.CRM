package com.andersenlab.crm.exceptions;

public final class ExceptionMessages {
    public static final String WRONG_ASSISTANT_ROLES_MESSAGE = "Множественность ролей для пользователя Sales assistant недоступна.";
    public static final String WRONG_ASSISTANT_WITHOUT_MENTOR_MESSAGE = "Необходимо указать ментора для ассистента.";
    public static final String WRONG_LOTTERY_PARTICIPANT_MESSAGE = "Участником распределения лидов может быть назначен только пользователь с ролью Sales.";
    public static final String WRONG_RESPONSIBLE_RM_MESSAGE = "Участником ДД может быть назначен только пользователь с ролью RM.";
    public static final String WRONG_LOTTERY_PARTICIPANT_HAS_NO_TELEGRAM_MESSAGE = "У участника распределения лидов должно быть указано Telegram имя";
    public static final String WRONG_MENTOR_TO_NON_ASSISTANT_MESSAGE = "Ментор может быть задан только для Sales assistant.";
    public static final String WRONG_MENTOR_ROLES_MESSAGE = "Ментором может быть назначен только пользователь с ролью Sales или Sales head.";
    public static final String WRONG_ROLES_MESSAGE = "Некорректный выбор ролей";
    public static final String WRONG_COUNTRIES_MESSAGE = "Некорректный выбор стран";
    public static final String LOGIN_EXISTS_MESSAGE = "Данный логин уже существует для пользователя '%s'. " +
            "Чтобы зарегистрировать нового пользователя с данным логином " +
            "Вам необходимо изменить логин пользователя '%s'.";
    public static final String UNIQUE_LOGIN_MESSAGE = "Login должен быть уникальным.";
    public static final String UNIQUE_TELEGRAM_NAME_MESSAGE = "Telegram имя должно быть уникальным.";
    public static final String UNIQUE_EMAIL_MESSAGE = "Email должен быть уникальным.";
    public static final String UNIQUE_EMAIL_MESSAGE_EN = "E-mail already exists.";
    public static final String EMPLOYEE_NOT_FOUND_MESSAGE = "Employee not found.";
    public static final String CHANGING_AD_PASS_MESSAGE = "Невозможно изменить пароль у пользователя из Active Directory.";

    private ExceptionMessages() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated.");
    }
}
