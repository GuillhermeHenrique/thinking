const User = require("../models/User");
const Thinking = require("../models/Thinking");

const { Op } = require("sequelize");

module.exports = class ThinkingController {
  static async showThinking(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const thinkingsData = await Thinking.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    const thinkings = thinkingsData.map((result) =>
      result.get({ plain: true })
    );

    let thinkingsQty = thinkings.length;

    if (thinkingsQty === 0) {
      thinkingsQty = false;
    }

    res.render("thinking/home", { thinkings, search, thinkingsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Thinking,
      plain: true,
    });

    // check if user exist
    if (!user) {
      res.redirect("/login");
    }

    const thinkings = user.Thinkings.map((result) => result.dataValues);

    let emptyThinkings = false;

    if (thinkings.length === 0) {
      emptyThinkings = true;
    }

    res.render("thinking/dashboard", { thinkings, emptyThinkings });
  }

  static createThinking(req, res) {
    res.render("thinking/create");
  }

  static async createThinkingSave(req, res) {
    const thinking = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Thinking.create(thinking);

      req.flash("message", "Successfully created Thinking!");

      req.session.save(() => {
        res.redirect("/thinking/dashboard");
      });
    } catch (error) {
      console.log("An error occurred" + error);
    }
  }

  static async removeThinking(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Thinking.destroy({ where: { id: id }, UserId: UserId });

      req.flash("message", "Thinking successfully deleted!");

      req.session.save(() => {
        res.redirect("/thinking/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateThinking(req, res) {
    const id = req.params.id;

    const thinking = await Thinking.findOne({ where: { id: id }, raw: true });

    res.render("thinking/edit", { thinking });
  }

  static async updateThinkingSave(req, res) {
    const id = req.body.id;

    const thinking = {
      title: req.body.title,
    };

    try {
      await Thinking.update(thinking, { where: { id: id } });

      req.flash("message", "Successfully updated Thinking!");

      req.session.save(() => {
        res.redirect("/thinking/dashboard");
      });
    } catch (error) {
      console.log("An error occurred" + error);
    }
  }
};
