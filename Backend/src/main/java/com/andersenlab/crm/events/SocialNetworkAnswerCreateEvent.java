package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class SocialNetworkAnswerCreateEvent {
    private final SocialNetworkAnswer socialNetworkAnswer;
}
