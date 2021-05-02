export var EntityState;
(function (EntityState) {
    EntityState[EntityState["None"] = 0] = "None";
    EntityState[EntityState["Adding"] = 1] = "Adding";
    EntityState[EntityState["Added"] = 2] = "Added";
    EntityState[EntityState["Ready"] = 3] = "Ready";
    EntityState[EntityState["Removing"] = 4] = "Removing";
    EntityState[EntityState["Removed"] = 5] = "Removed";
})(EntityState || (EntityState = {}));
//# sourceMappingURL=types.js.map