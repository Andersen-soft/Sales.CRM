package com.andersenlab.crm.model;


import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Source name define the company created from
 */


@Getter
@AllArgsConstructor
public enum SourceName implements Nameable {
  MAIL("E-mail"),
  RECOMMENDATION("Recommendation"),
  SITE("Site"),
  LINKEDIN("LinkedIn"),
  VIADEO("Viadeo"),
  XING("Xing"),
  ANGEL("Angel"),
  PERSONAL_CONTACT("Personal contact");

  private final String name;
}