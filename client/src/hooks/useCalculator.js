import { useState, useMemo, useCallback } from "react";
import { features, maintenancePlans } from "../data/pricingData";

const useCalculator = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [customAddOns, setCustomAddOns] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState("none");
  const [discount, setDiscount] = useState(0);
  const [urgentDelivery, setUrgentDelivery] = useState(false);

  // Toggle feature selection
  const toggleFeature = useCallback((featureId) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureId)) {
        return prev.filter((id) => id !== featureId);
      }
      return [...prev, featureId];
    });
  }, []);

  // Select multiple features at once (for packages)
  const selectFeatures = useCallback((featureIds) => {
    setSelectedFeatures(featureIds);
  }, []);

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelectedFeatures([]);
    setCustomAddOns([]);
    setSelectedMaintenance("none");
    setDiscount(0);
    setUrgentDelivery(false);
  }, []);

  // Add custom add-on
  const addCustomAddOn = useCallback((addOn) => {
    if (addOn.name && addOn.price > 0) {
      setCustomAddOns((prev) => [...prev, { ...addOn, id: Date.now() }]);
    }
  }, []);

  // Remove custom add-on
  const removeCustomAddOn = useCallback((addOnId) => {
    setCustomAddOns((prev) => prev.filter((a) => a.id !== addOnId));
  }, []);

  // Calculate totals
  const calculations = useMemo(() => {
    // Features subtotal
    const featuresSubtotal = selectedFeatures.reduce((total, featureId) => {
      const feature = features.find((f) => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);

    // Custom add-ons subtotal
    const addOnsSubtotal = customAddOns.reduce((total, addOn) => {
      return total + (Number(addOn.price) || 0);
    }, 0);

    // Base subtotal
    const baseSubtotal = featuresSubtotal + addOnsSubtotal;

    // Urgent delivery charge (20% extra)
    const urgentCharge = urgentDelivery ? baseSubtotal * 0.2 : 0;

    // Subtotal with urgent
    const subtotalWithUrgent = baseSubtotal + urgentCharge;

    // Discount amount
    const discountAmount = subtotalWithUrgent * (discount / 100);

    // After discount
    const afterDiscount = subtotalWithUrgent - discountAmount;

    // Maintenance cost
    const maintenancePlan = maintenancePlans.find(
      (p) => p.id === selectedMaintenance
    );
    const maintenanceCost = maintenancePlan?.price || 0;

    // GST (18%)
    const gst = (afterDiscount + maintenanceCost) * 0.18;

    // Grand total
    const grandTotal = afterDiscount + maintenanceCost + gst;

    // Estimated days
    const estimatedDays = selectedFeatures.reduce((total, featureId) => {
      const feature = features.find((f) => f.id === featureId);
      return total + (feature?.estimatedDays || 0);
    }, 0);

    // With urgent delivery, reduce time by 30%
    const finalDays = urgentDelivery
      ? Math.ceil(estimatedDays * 0.7)
      : estimatedDays;

    return {
      featuresSubtotal,
      addOnsSubtotal,
      baseSubtotal,
      urgentCharge,
      subtotalWithUrgent,
      discountAmount,
      afterDiscount,
      maintenanceCost,
      gst,
      grandTotal,
      estimatedDays: finalDays,
      selectedCount: selectedFeatures.length,
      addOnsCount: customAddOns.length,
    };
  }, [
    selectedFeatures,
    customAddOns,
    discount,
    urgentDelivery,
    selectedMaintenance,
  ]);

  // Get selected feature objects
  const selectedFeatureObjects = useMemo(() => {
    return selectedFeatures
      .map((id) => features.find((f) => f.id === id))
      .filter(Boolean);
  }, [selectedFeatures]);

  return {
    // State
    selectedFeatures,
    customAddOns,
    selectedMaintenance,
    discount,
    urgentDelivery,

    // Actions
    toggleFeature,
    selectFeatures,
    clearAll,
    addCustomAddOn,
    removeCustomAddOn,
    setSelectedMaintenance,
    setDiscount,
    setUrgentDelivery,

    // Computed
    calculations,
    selectedFeatureObjects,
  };
};

export default useCalculator;
