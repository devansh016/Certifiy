const eventModel = require("../models/eventModel");

async function addEventData({name, font, fontSize, fontColor, positionX, positionY}){
	var event = await eventModel.findOne({name})
	if(!event){
		return {
			status: "failure",
			message: "No template exists with the following name.",
		}
	}
	
	event.settings.font = font
	event.settings.fontSize = fontSize
	event.settings.fontColor = fontColor
	event.settings.positionX = positionX
	event.settings.positionY = positionY
	event.readyToUse = true
	await event.save();

	return {
		status: "success",
		message: "Event data saved.",
	}
}

module.exports = {
	addEventData
}