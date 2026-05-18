package com.property.portal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.property.portal.entity.Property;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PropertyMapper extends BaseMapper<Property> {
}
