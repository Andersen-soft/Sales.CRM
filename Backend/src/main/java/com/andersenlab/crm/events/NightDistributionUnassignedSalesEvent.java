package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.CompanySale;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NightDistributionUnassignedSalesEvent {
    private List<CompanySale> unassignedSales;
}
