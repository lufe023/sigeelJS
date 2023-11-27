const { Sequelize, Op } = require("sequelize");
const Banners = require("../models/banner.model")
const uuid = require("uuid");

const createBannerController = async (data) => {
    const newUser = await Banners.create({
        id: uuid.v4(),
        title: data.title,
        subtitle: data.subtitle,
        body: data.body,
        place: data.place,
        createdBy: data.createdBy,
    });
    return newUser;
};

    const updateBannerController = async (id, data) => {
    const update = await Banners.update(
        {
            data,
        },
        {
        where: {
            id,
        },
        })
    
    return update
    }

const deleteBannerController = async (id) => {
    const data = await Banners.destroy({
    where: {
    id,
    },
    });
    return data;
};

/* 
campos del modelo Banner
id
title
subtitle
body
place
createdBy
  */

module.exports = {
    createBannerController,
    updateBannerController,
    deleteBannerController
}