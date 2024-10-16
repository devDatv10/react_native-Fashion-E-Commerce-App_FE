import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import IconWithBadge from "../components/IconWithBadge";
import AddToCartButton from "../components/AddToCartButton";
import CustomButton from "../components/CustomButton";
import ColorSelector from "../components/ColorSelector";
import SizeSelector from "../components/SizeSelector";
import ProductInfoInDetail from "../components/ProductInfoInDetail";
import Colors from "../themes/Color";
import ShowAlertWithTitleContentAndOneActions from "../components/ShowAlertWithTitleContentAndOneActions ";

const { width, height } = Dimensions.get("window");

const images = [
  require("../assets/image/shirt-1.jpg"),
  require("../assets/image/shirt-2.jpg"),
  require("../assets/image/shirt-2.jpg"),
  // require("../assets/image/shirt-3.jpg"),
];

export default function ProductDetailScreen({ navigation }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setSelectedImageIndex(newIndex);
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
                source={image}
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
          <IconWithBadge
            name="shopping-bag"
            badgeCount={3}
            size={25}
            color={Colors.blackColor}
          />
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
      <View style={styles.itemTwo}>
        <View style={styles.infoIcon}>
          <ProductInfoInDetail
            brandName="H&M"
            rating="4.9"
            numberRating="136"
            productName="Oversized Fit Printed Mesh T-Shirt"
            oldPrice="550.00"
            newPrice="295.00"
          />
          <Feather name="heart" size={22} color={Colors.blackColor} />
        </View>
        <Text style={styles.productDescription}>
          Mô tả sản phẩm: Oversized t-shirt in printed mesh with a V-neck,
          dropped shoulders and a straight-cut hem. Oversized t-shirt in printed
          mesh with a V-neck, dropped shoulders and a straight-cut hem.
        </Text>
        <View style={styles.selectionRow}>
          <View style={styles.column}>
            <ColorSelector />
          </View>
          <View style={styles.column}>
            <SizeSelector />
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
      </View>
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
    top: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.blackColor,
    fontWeight: "bold",
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
    height: height / 2,
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
    marginTop: 25,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
    gap: 30,
  },
});
