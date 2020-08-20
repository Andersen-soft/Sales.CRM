package com.andersenlab.crm.model.entities;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertTrue;

public class CompanySaleTest {

	@Test
	public void defineStatusesPre() {
		String value = "ПрЕ";
		List<CompanySale.Status> statuses = CompanySale.Status.defineStatuses(value);
        assertTrue("Statuses can't contain PRELEAD", statuses.contains(CompanySale.Status.PRELEAD));
	}

	@Test
	public void defineStatusesLead() {
		String value = "ли";
		List<CompanySale.Status> statuses = CompanySale.Status.defineStatuses(value);
        assertTrue("Statuses can't contain PRELEAD", statuses.contains(CompanySale.Status.PRELEAD));
        assertTrue("Statuses can't contain LEAD", statuses.contains(CompanySale.Status.LEAD));
	}
}