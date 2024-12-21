import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import apiService from "../../api/ApiService";
import { FontAwesome, Feather } from "@expo/vector-icons";
import IconWithBadge from "../../components/IconWithBadge";
import AddToCartButton from "../../components/AddToCartButton";
import CustomButton from "../../components/CustomButton";
import ColorSelector from "../../components/ColorSelector";
import SizeSelector from "../../components/SizeSelector";
import ProductInfoInDetail from "../../components/ProductInfoInDetail";
import Colors from "../../styles/Color";
import ShowAlertWithTitleContentAndOneActions from "../../components/ShowAlertWithTitleContentAndOneActions ";
import ShowAlertWithTitleContentAndTwoActions from "../../components/ShowAlertWithTitleContentAndTwoActions ";
import NoReviewBox from "../../components/NoReviewBox";
import ReviewBox from "../../components/ReviewBox";
import WriteReviewModal from "../../components/WriteReviewModal";
import ReviewSubmittedSuccessModal from "../../components/ReviewSubmittedSuccessModal";

const { width, height } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }) {
  const [storeName, setStoreName] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const { product, images, colors, sizes } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  // const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isWriteReviewModalVisible, setWriteReviewModalVisible] = useState(false);
  const [isReviewSubmittedSuccessModalVisible, setReviewSubmittedSuccessModalVisible] = useState(false);
  const [submittedReviewData, setSubmittedReviewData] = useState(null);

  useEffect(() => {
    const fetchCustomerId = async () => {
      const customerId = await SecureStore.getItemAsync("customer_id");
      setCustomerId(customerId);
    };

    const checkIfFavorite = async () => {
      const customerId = await SecureStore.getItemAsync("customer_id");
      if (!customerId) return;

      const response = await apiService.checkFavoriteProduct({
        customer_id: customerId,
        product_id: product.productId,
      });

      if (response.status === 200) {
        setIsFavorite(response.data.isFavorite);
      }
    };

    const getReviewsByProductId = async () => {
      try {
        const response = await apiService.getReviewByProductId(
          product.productId
        );

        if (response.status === 200) {
          const fetchedReviews = response?.data?.data || [];

          if (fetchedReviews.length > 0) {
            setReviews(fetchedReviews);
          } else {
            setReviews(null);
          }
        } else {
          setReviews(null);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(null);
      }
    };

    fetchCustomerId();
    checkIfFavorite();
    loadStoreName();
    getReviewsByProductId();
  }, []);

  const reloadReviews = async () => {
    try {
      const response = await apiService.getReviewByProductId(product.productId);
      if (response.status === 200) {
        setReviews(response?.data?.data || []);
      } else {
        setReviews(null);
      }
    } catch (error) {
      console.error("Error reloading reviews:", error);
      setReviews(null);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const customerId = await SecureStore.getItemAsync("customer_id");
      if (!customerId) {
        console.warn("No customer ID found in SecureStore.");
        return;
      }

      const productData = {
        customer_id: customerId,
        product_id: product.productId,
      };

      const response = await apiService.addProductToFavorite(productData);
      if (response.status === 201) {
        // console.log("Product added to wishlist successfully");
        setIsFavorite(true);
        Alert.alert("Success", "Product added to wishlist.");
      } else {
        // console.error("Failed to add product to wishlist");
        Alert.alert("Error", "Could not add product to wishlist. Try again.");
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setSelectedImageIndex(newIndex);
  };

  const loadStoreName = async () => {
    try {
      const response = await apiService.getStores();
      if (response && response.data.data && response.data.data[0]) {
        setStoreName(response.data.data[0].store_name);
      }
    } catch (error) {
      console.error("Failed to load store name:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemOne}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Product</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <IconWithBadge
              name="shopping-bag"
              badgeCount={3}
              size={25}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.indicatorWrapper}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === selectedImageIndex ? styles.activeIndicator : {},
              ]}
            />
          ))}
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.itemTwo}>
          <View style={styles.infoIcon}>
            <ProductInfoInDetail
              categoryName={storeName}
              averageReview={product.averageReview.toString()}
              totalReview={product.totalReview.toString()}
              productName={product.productName}
              oldPrice={product.oldPrice.toString()}
              newPrice={product.newPrice.toString()}
            />
            <TouchableOpacity
              onPress={() =>
                ShowAlertWithTitleContentAndTwoActions(
                  "Notification",
                  "Add product to wishlist?",
                  handleAddToWishlist,
                  () => console.log("User cancelled adding product to wishlist")
                )
              }
            >
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={22}
                color={isFavorite ? "#ff0034" : Colors.blackColor}
              />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.productDescription}>{product.description}</Text> */}
          <View>
            <Text
              style={styles.productDescription}
              numberOfLines={isExpanded ? undefined : 4}
            >
              {isExpanded
                ? product.description
                : product.description.slice(0, 180)}
              {!isExpanded && product.description.length > 100 && (
                <Text
                  style={styles.toggleText}
                  onPress={() => setIsExpanded(true)}
                >
                  ...See more
                </Text>
              )}
            </Text>
            {isExpanded && (
              <TouchableOpacity onPress={() => setIsExpanded(false)}>
                <Text style={styles.toggleText}>Less</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.selectionRow}>
            <View style={styles.column}>
              <ColorSelector colors={colors} />
            </View>
            <View style={styles.column}>
              <SizeSelector sizes={sizes} />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <AddToCartButton
              iconName="shopping-bag"
              title="ADD TO CART"
              backgroundColor={Colors.whiteColor}
              color={Colors.blackColor}
              borderColor={Colors.blackColor}
              onPress={() =>
                ShowAlertWithTitleContentAndOneActions(
                  "Notification",
                  "Product added to cart successfully"
                )
              }
            />
            <CustomButton
              title="BUY NOW"
              backgroundColor={Colors.blackColor}
              onPress={() => console.log("BUY NOW Clicked")}
            />
          </View>
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewContainerTitle}>CUSTOMER REVIEW</Text>
            {reviews === null ? (
              <NoReviewBox
                title="Customer Reviews"
                subtitle="No review yet. Any feedback? Let us know"
                buttonText="Write Review"
                onWriteReview={() => setWriteReviewModalVisible(true)}
              />
            ) : (
              <ReviewBox
                reviews={reviews}
                onWriteReview={() => setWriteReviewModalVisible(true)}
              />
            )}
            {isWriteReviewModalVisible && !isReviewSubmittedSuccessModalVisible && (
              <WriteReviewModal
                visible={isWriteReviewModalVisible}
                onClose={() => setWriteReviewModalVisible(false)}
                customerId={customerId}
                productId={product.productId}
                productName={product.productName}
                productImage={images[selectedImageIndex]}
                onSubmit={(data) => {
                  setSubmittedReviewData(data);
                  setWriteReviewModalVisible(false);
                  setReviewSubmittedSuccessModalVisible(true);
                }}
              />
            )}

            {isReviewSubmittedSuccessModalVisible && submittedReviewData && (
              <ReviewSubmittedSuccessModal
                visible={isReviewSubmittedSuccessModalVisible}
                onClose={() => {
                  setReviewSubmittedSuccessModalVisible(false);
                  reloadReviews();
                }}
                {...submittedReviewData}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayBgColor,
    paddingTop: 10,
  },
  itemOne: {
    height: height / 2,
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    width: width,
    height: height / 2,
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 38,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.blackColor,
    fontWeight: "600",
  },
  indicatorWrapper: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.indicatorDefaultColor,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.indicatorActiveColor,
  },
  itemTwo: {
    // height: height / 2,
    backgroundColor: Colors.whiteBgColor,
    padding: 18,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoIcon: {
    flexDirection: "row",
    paddingRight: 20,
  },
  productDescription: {
    fontSize: 18,
    color: Colors.textDescription,
    marginTop: 20,
    marginBottom: 20,
    lineHeight: 25,
    textAlign: "justify",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textDescription,
    textDecorationLine: "none",
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 30,
  },
  reviewContainer: {
    marginTop: 35,
  },
  reviewContainerTitle: {
    fontSize: 18,
  },
});
