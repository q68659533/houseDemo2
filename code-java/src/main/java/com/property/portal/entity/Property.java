package com.property.portal.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("properties")
public class Property {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("square_footage")
    private Double squareFootage;

    @TableField("bedrooms")
    private Integer bedrooms;

    @TableField("bathrooms")
    private Integer bathrooms;

    @TableField("year_built")
    private Integer yearBuilt;

    @TableField("lot_size")
    private Double lotSize;

    @TableField("distance_to_city_center")
    private Double distanceToCityCenter;

    @TableField("school_rating")
    private Integer schoolRating;

    @TableField("actual_price")
    private Double actualPrice;
}
