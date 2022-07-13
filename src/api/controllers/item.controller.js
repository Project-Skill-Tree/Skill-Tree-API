const Item = require("../../models/item.model");

class ItemController {
  async getItems(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving an item'
      #swagger.tags = ['Item']
      #swagger.produces = ['application/json']
      #swagger.responses[200] = {
          description: 'A collection of items',
          schema: [{
            $ref: '#/definitions/Item'
          }]
      }
    */
    console.log("GET /items");

    const items = await Item.find({});

    res.status(200).json({
      response: "success",
      items: items});
  }

  async createItem(req, res) {
    /*
      #swagger.description = 'Endpoint for creating an item'
      #swagger.tags = ['Item']
    */
    console.log("POST /items/create");

    const item = new Item(req.body);

    item.save();
    return res.status(201).json({
      response: "success",
      item: item
    });
  }

  async updateItem(req, res) {
    /*
      #swagger.description = 'Endpoint for updating an item'
      #swagger.tags = ['Item']
    */
    console.log("POST /items/update");

    const item = Item.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    item.save();
    res.status(200).json({response: "success"});
  }

  async deleteItem(req, res) {
    /*
      #swagger.description = 'Endpoint for deleting an item'
      #swagger.tags = ['Item']
    */
    console.log("POST /items/delete");

    Item.findByIdAndDelete(req.body.id);
    res.status(200).json({response: "success"});
  }
}

module.exports = new ItemController();
