import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import ProductCard from "../../components/Product/ProductCard";
import { Feather, MaterialIcons } from "react-native-vector-icons";
import FilterBox from "../../components/Other/FilterBox";
import CategoryForm from "../../components/Category/CategoryForm";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

const ExploreScreen = ({ navigation }) => {
  const [storeName, setStoreName] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // load data
    loadStoreName();
    loadCategories();
    loadListAllProducts();
  }, []);

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

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(
        response.data.data.map((item) => ({
          categoryId: item.category_id,
          categoryName: item.category_name,
          imageCategory: {
            uri: `${API_BASE_URL}${item.image_category}`,
          },
        }))
      );
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadListAllProducts = async () => {
    try {
      const response = await apiService.getListAllProducts();
      // console.log("API Response:", response);
      const productsArray = response.data.data;

      if (!Array.isArray(productsArray)) {
        throw new Error("API response.data is not an array");
      }

      setProducts(
        productsArray.map((item) => ({
          productId: item.product_id,
          productImage: {
            uri: `${API_BASE_URL}${item.image[0].url}`,
          },
          imageArr: item.image.map((img) => `${API_BASE_URL}${img.url}`),
          categoryName: item.category_name,
          averageReview: item.average_review,
          totalReview: item.total_review,
          productName: item.product_name,
          description: item.description,
          oldPrice: item.old_price,
          newPrice: item.new_price,
          colorArr: item.color.map((color) => `${color.color_code}`),
          sizeArr: item.size.map((size) => `${size.size}`),
        }))
      );
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search H&M"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity>
            <View style={styles.micContainer}>
              <MaterialIcons
                name="mic"
                size={22}
                color="#333"
                // style={styles.micIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            <FilterBox text="Filter" icon="filter-list" />
            <FilterBox text="Ratings" icon="keyboard-arrow-down" />
            <FilterBox text="Size" icon="keyboard-arrow-down" />
            <FilterBox text="Color" icon="keyboard-arrow-down" />
            <FilterBox text="Price" icon="keyboard-arrow-down" />
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            <CategoryForm
              categories={categories}
              containerStyle={styles.customContainer}
            />
          </ScrollView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          >
            <View style={styles.productContainer}>
              {products.map((product, index) => (
                <ProductCard
                  key={product.productId}
                  imageSource={product.productImage}
                  storeName={storeName}
                  // categoryName={product.categoryName}
                  averageReview={product.averageReview}
                  totalReview={product.totalReview}
                  productName={product.productName}
                  description={product.description}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  color={product.colorArr}
                  size={product.sizeArr}
                  onPress={() =>
                    navigation.navigate("ProductDetailScreen", {
                      product,
                      images: product.imageArr,
                      colors: product.colorArr,
                      sizes: product.sizeArr,
                    })
                  }
                  cardWidth={Dimensions.get("window").width * 0.43}
                  imageWidth={"125%"}
                  imageHeight={"125%"}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: Colors.grayBgColor,
    backgroundColor: Colors.whiteColor,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.blackColor,
  },
  micContainer: {
    height: 35,
    width: 35,
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
  filterList: {
    height: 40,
    gap: 5,
    marginBottom: 30,
  },
  productList: {
    // paddingVertical: 10,
    marginBottom: 50,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default ExploreScreen;
