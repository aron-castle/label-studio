import { types, getParent, getEnv, flow, destroy, getMembers } from "mobx-state-tree";

import { guidGenerator } from "../core/Helpers";
import Types from "../core/Types";

import { TextRegionModel } from "../interfaces/object/TextRegion";
import { RectRegionModel } from "../interfaces/object/RectRegion";
import { AudioRegionModel } from "../interfaces/object/AudioRegion";

const Normalization = types
  .model("Normalization", {
    node1: types.union(
      types.reference(TextRegionModel),
      types.reference(RectRegionModel),
      types.reference(AudioRegionModel),
    ),
    node2: types.union(
      types.reference(TextRegionModel),
      types.reference(RectRegionModel),
      types.reference(AudioRegionModel),
    ),
  })
  .actions(self => ({
    toggleHighlight() {
      if (self.node1 == self.node2) {
        self.node1.toggleHightlight();
      } else {
        self.node1.toggleHightlight();
        self.node2.toggleHightlight();
      }
    },
  }));

export default types
  .model("NormalizationStore", {
    normalizations: types.array(Normalization),
  })
  .actions(self => ({
    findNormalization(node1, node2) {
      if (!node2) {
        return self.normalizations.find(rl => {
          return rl.node1.id == node1.id || rl.node2.id == node1.id;
        });
      }

      return self.normalizations.find(rl => {
        return rl.node1.id == node1.id && rl.node2.id == node2.id;
      });
    },

    addNormalization(node1, node2) {
      if (self.findNormalization(node1, node2)) return;

      const rl = Normalization.create({
        node1: node1,
        node2: node2,
      });

      self.normalizations.unshift(rl);

      return rl;
    },

    deleteNormalization(rl) {
      destroy(rl);
    },

    deleteNodeNormalization(node) {
      // lookup $node and delete it's normalization
      const rl = self.findNormalization(node);

      if (rl) self.deleteNormalization(rl);
    },
  }));
