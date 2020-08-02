package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Comment;
import com.andersenlab.crm.model.entities.QComment;

public interface CommentRepository extends BaseRepository<QComment, Comment, Long> {
}
