/**
 * A specialized form used to pop out the editor.
 * @extends {FormApplication}
 */
export default class PopoutEditor extends FormApplication {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "popout-editor",
      classes: ["starwarsffg", "sheet"],
      title: "Pop-out Editor",
      template: "systems/starwarsffg/templates/popout-editor.html",
      width: 320,
      height: 320,
    });
  }

  /**
   * Return a reference to the target attribute
   * @type {String}
   */
  get attribute() {
    return this.options.name;
  }

  /** @override */
  getData() {
    // Get current value
    let attr = getProperty(this.object.data, this.attribute);

    // Return data
    return {
      value: attr,
      cssClass: "editable popout-editor-window",
    };
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {
    const updateData = {};
    updateData[`${this.attribute}`] = formData.value;

    // Update the object
    this.object.update(updateData);

    this.close();
  }

  /**
   * Renders the dice symbols based on strings
   * @param  {String} string
   */
  static renderDiceImages(str, actorData) {
    let html = str || "";

    html = this.replaceRollTags(html, actorData);
    try {
      html = TextEditor.enrichHTML(html, { secrets: true, entities: true });
    } catch (err) {
      // ignore the message below, it means that we already created an entity link (this could be part of an editor text)
      if (err.message !== "An Entity subclass must configure the EntityCollection it belongs to.") {
        CONFIG.logger.error(err);
      }
    }

    const dicetheme = game.settings.get("starwarsffg", "dicetheme");

    const replaceValues = [
      {
        type: "ability",
        character: "d",
        class: "starwars",
        pattern: /\[(AB)(ILITY)?\]/gim,
      },
      {
        type: "advantage",
        character: "a",
        class: dicetheme,
        pattern: /\[(AD)(VANTAGE)?\]/gim,
      },
      {
        type: "boost",
        character: "b",
        class: "starwars",
        pattern: /\[(BO)(OST)?\]/gim,
      },
      {
        type: "challenge",
        character: "c",
        class: "starwars",
        pattern: /\[(CH)(ALLENGE)?\]/gim,
      },
      {
        type: "dark",
        character: "z",
        class: "starwars",
        pattern: /\[(DA)(RK)?\]/gim,
      },
      {
        type: "despair",
        character: dicetheme === "starwars" ? "y" : "d",
        class: dicetheme,
        pattern: /\[(DE)(SPAIR)?\]/gim,
      },
      {
        type: "difficulty",
        character: "d",
        class: "starwars",
        pattern: /\[(DI)(FFICULTY)?\]/gim,
      },
      {
        type: "forcepoint",
        character: "Y",
        class: "starwars",
        pattern: /\[(FP|FORCEPOINT)\]/gim,
      },
      {
        type: "failure",
        character: "f",
        class: dicetheme,
        pattern: /\[(FA)(ILURE)?\]/gim,
      },
      {
        type: "force",
        character: "C",
        class: "starwars",
        pattern: /\[(FO)(RCE)?\]/gim,
      },
      {
        type: "light",
        character: "Z",
        class: "starwars",
        pattern: /\[(LI)(GHT)?\]/gim,
      },
      {
        type: "proficiency",
        character: "c",
        class: "starwars",
        pattern: /\[(PR)(OFICIENCY)?\]/gim,
      },
      {
        type: "remsetback",
        character: "b",
        class: "starwars",
        pattern: /\[(RS*|REMSETBACK)\]/gim,
      },
      {
        type: "restricted",
        character: "z",
        class: "starwars",
        pattern: /\[(RE)(STRICTED)?\]/gim,
      },
      {
        type: "setback",
        character: "b",
        class: "starwars",
        pattern: /\[(SE)(TBACK)?\]/gim,
      },
      {
        type: "success",
        character: "s",
        class: dicetheme,
        pattern: /\[(SU)(CCESS)?\]/gim,
      },
      {
        type: "threat",
        character: dicetheme === "starwars" ? "t" : "h",
        class: dicetheme,
        pattern: /\[(TH)(REAT)?\]/gim,
      },
      {
        type: "triumph",
        character: dicetheme === "starwars" ? "x" : "t",
        class: dicetheme,
        pattern: /\[(TR)(IUMPH)?\]/gim,
      },
      {
        type: "adddifficulty",
        character: "d",
        class: "starwars",
        pattern: /\[(DD|ADDDIFFICULTY)\]/gim,
      },
      {
        type: "updifficulty",
        character: "d",
        class: "starwars",
        pattern: /\[(UD|UPDIFFICULTY)\]/gim,
      },
      {
        type: "cancelthreat",
        character: "t",
        class: dicetheme,
        pattern: /\[(CT|CANCELTHREAT)\]/gim,
      },
    ];

    replaceValues.forEach((item) => {
      html = html.replace(item.pattern, `<span class='dietype ${item.class} ${item.type}'>${item.character}</span>`);
    });

    const oggdudeTags = [
      {
        startTag: "<span class='bold'>",
        endTag: "</span>",
        pattern: /(\[B\])(.[^\[]*)\[b\]/gm,
      },
      {
        startTag: "<p>",
        endTag: "</p>",
        pattern: /(\[P\])(.[^\[]*)/gm,
      },
      {
        startTag: "<br />",
        endTag: "",
        pattern: /(\[BR\])(.[^\[]*)/gm,
      },
      {
        startTag: "<span class='italic'>",
        endTag: "</span>",
        pattern: /(\[I\])(.[^\[]*)\[i\]/gm,
      },
      {
        startTag: "<h1>",
        endTag: "</h1>",
        pattern: /(\[H1\])(.[^\[]*)\[h1\]/gm,
      },
      {
        startTag: "<h2>",
        endTag: "</h2>",
        pattern: /(\[H2\])(.[^\[]*)\[h2\]/gm,
      },
      {
        startTag: "<h3>",
        endTag: "</h3>",
        pattern: /(\[H3\])(.[^\[]*)\[h3\]/gm,
      },
      {
        startTag: "<h4>",
        endTag: "</h4>",
        pattern: /(\[H4\])(.[^\[]*)\[h4\]/gm,
      },
    ];

    oggdudeTags.forEach((item) => {
      html = html.replace(item.pattern, `${item.startTag}$2${item.endTag}`);
    });

    return html;
  }

  static replaceRollTags(html, actorData) {
    const rollTag = /(\[ROLL\])(.[^\[]*)\[\/ROLL\]/gm;
    const formula = html.replace(rollTag, function (content) {
      content = content.replace(rollTag, `$2`);
      const args = content.split(",").map(function (arg) {
        return arg.trim();
      });
      const di = "[DI]";
      let difficulty = "";
      switch (args[1]) {
        case "0":
          difficulty = "Simple";
          break;
        case "1":
          difficulty = "Easy";
          break;
        case "2":
          difficulty = "Average";
          break;
        case "3":
          difficulty = "Hard";
          break;
        case "4":
          difficulty = "Daunting";
          break;
        case "5":
          difficulty = "Formidable";
          break;
      }
      const id = actorData?._id ? actorData._id : "";

      let formula = `<span class="rollable rollSkillDirect" data-skill="${args[0]}" data-difficulty="${args[1]}" data-actor-id="${id}"><strong>${difficulty} (${di.repeat(args[1])}) ${args[0]}</strong></span>`;
      return formula;
    });

    return formula;
  }
}
