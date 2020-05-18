import cmd from '../mapshaper-cmd';
import { mergeLayersForOverlay } from '../clipping/mapshaper-overlay-utils';
import { requirePolygonLayer } from '../dataset/mapshaper-layer-utils';

// TODO: make sure that the inlay shapes and data are not shared
cmd.inlay = function(targetLayers, src, targetDataset, opts) {
  var mergedDataset = mergeLayersForOverlay(targetLayers, targetDataset, src, opts);
  var inlayLyr = mergedDataset.layers[mergedDataset.layers.length - 1];
  requirePolygonLayer(inlayLyr);
  targetLayers.forEach(requirePolygonLayer);
  var eraseSrc = {layer: inlayLyr, dataset: mergedDataset};
  var erasedLayers = cmd.eraseLayers(targetLayers, eraseSrc, mergedDataset, opts);
  var outputLayers = erasedLayers.map(function(lyr) {
    // similar to applyCommandToLayerSelection() (mapshaper-command-utils.js)
    var lyr2 = cmd.mergeLayers([lyr, inlayLyr], {force: true})[0];
    lyr2.name = lyr.name;
    return lyr2;
  });
  targetDataset.arcs = mergedDataset.arcs;
  return outputLayers;
};