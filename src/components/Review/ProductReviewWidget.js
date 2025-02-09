import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";
import Colors from "../../styles/Color";
import ScoreBar from "./ScoreBar";
import API_BASE_URL from "../../configs/config";
import WidgetLoading from "./WidgetLoading";
import apiService from "../../api/ApiService";
import NoFilterResultModal from "./NoFilterResultModal";
import ReviewDetailModal from "./ReviewDetailModal";
import {
  getRandomColor,
  getContrastColor,
} from "../../../src/utils/colorUtils";
import { formatDate } from "../../../src/utils/dateUtils";

const ProductReviewWidget = ({ reviews, onWriteReview }) => {
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleReviews = useMemo(() => {
    const source = filteredReviews.length > 0 ? filteredReviews : reviews;
    return source.slice(0, visibleCount);
  }, [filteredReviews, reviews, visibleCount]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const loadMoreReviews = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newCount = visibleCount + 3;
      setVisibleCount(newCount > reviews.length ? reviews.length : newCount);
      setIsLoading(false);
    }, 1000);
  };

  const allImagesWithRatings = useMemo(() => {
    return reviews
      .filter(
        (review) => Array.isArray(review.media) && review.media.length > 0
      )
      .flatMap((review) =>
        review.media.map((image) => ({
          uri: `${API_BASE_URL}${image}`,
          stars_review: review.stars_review,
        }))
      );
  }, [reviews]);

  const onFilterReviews = async (star, productId) => {
    setIsLoading(true);
    try {
      const response = await apiService.filterReviewsByStar(star, productId);
      if (response.status === 200) {
        const filteredReviews = response.data.data || [];
        setFilteredReviews(filteredReviews);
      } else {
        console.error("Failed to filter reviews", response.status);
      }
    } catch (error) {
      console.error("Error while filtering reviews", error);
      setFilteredReviews([]);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const openModal = (image) => {
    const review = reviews.find((rev) =>
      rev.media.some((media) => `${API_BASE_URL}${media}` === image.uri)
    );
    if (review) {
      // console.log("Data passed to ReviewDetailModal:", review);
      setSelectedReview(review);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const renderReview = ({ item }) => {
    const backgroundColor = getRandomColor();
    const textColor = getContrastColor(backgroundColor);

    return (
      <View style={styles.reviewContainer}>
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor }]}>
            <Text style={[styles.avatarText, { color: textColor }]}>
              {`${item.customer_name.trim().charAt(0)}${item.customer_name
                .trim()
                .split(" ")
                .pop()
                .charAt(0)}`}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <View style={styles.reviewDateBox}>
              <MaterialIcons name="verified" size={12} color="#2196F3" />
              <Text style={styles.reviewDate}>
                Review on {formatDate(item.review_date)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={20}
                color={
                  index < item.stars_review
                    ? Colors.yellowColor
                    : Colors.starColorNoRating
                }
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewTitle}>{item.review_title}</Text>
        <Text style={styles.reviewContent}>{item.review_product}</Text>

        {item.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {item.media.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  openModal({
                    uri: `${API_BASE_URL}${image}`,
                    stars_review: item.stars_review,
                  })
                }
              >
                <Image
                  source={{ uri: `${API_BASE_URL}${image}` }}
                  style={styles.reviewImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <TouchableOpacity style={styles.likeButton}>
            <AntDesign name="like1" size={18} color={Colors.darkGray} />
            <Text style={styles.likeCountText}>(0)</Text>
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        </View>
        {item.reply && item.admin_id && (
          <View style={styles.replyReviewContainer}>
            <View style={styles.row}>
              <Text style={styles.replyFrom}>Reply from {item.admin_name}</Text>
            </View>
            <Text style={styles.replyText}>{item.reply}</Text>
          </View>
        )}

        <View style={styles.dividerReview} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.reviewContainerTitle}>CUSTOMER REVIEW</Text>
      <View style={styles.reviewCard}>
        <View style={styles.statsContainer}>
          <View style={styles.averageReviewContainer}>
            <Text style={styles.averageReview}>
              {reviews[0]?.average_review || "0.0"}
            </Text>
            <FontAwesome
              name="star"
              size={25}
              color={Colors.yellowColor}
              style={styles.starIcon}
            />
          </View>

          <Text style={styles.totalReview}>
            {reviews[0]?.total_review || 0} Reviews
          </Text>
          <ScoreBar
            reviews={reviews}
            onFilterByStar={(star) =>
              onFilterReviews(star.toString(), reviews[0]?.product_id)
            }
          />
          <View style={styles.divider} />
          <Text style={styles.titleReviewCard}>Review this product</Text>
          <Text style={styles.subtitleReviewCard}>
            Share your thought with other customers
          </Text>
          <TouchableOpacity style={styles.button} onPress={onWriteReview}>
            <Text style={styles.buttonText}>Write a review</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.divider} /> */}
      <View style={styles.imageReviewContainer}>
        <Text style={styles.title}>Image from reviews</Text>
        <TouchableOpacity>
          <Text style={styles.allPhotos}>All photos</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScrollContainer}
      >
        {allImagesWithRatings.map((item, index) =>
          item.uri ? (
            <TouchableOpacity
              key={index}
              style={styles.imageBox}
              onPress={() => {
                openModal(item);
              }}
            >
              <Image source={{ uri: item.uri }} style={styles.reviewImages} />
              <View style={styles.ratingOverlay}>
                <FontAwesome name="star" size={14} color={Colors.yellowColor} />
                <Text style={styles.ratingText}>{item.stars_review}</Text>
              </View>
            </TouchableOpacity>
          ) : null
        )}

        {isModalVisible && selectedReview && (
          <ReviewDetailModal
            visible={isModalVisible}
            review={selectedReview}
            onClose={closeModal}
          />
        )}
      </ScrollView>

      <Text style={styles.title}>Reviews with comments</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterButtonsContainer}
      >
        {[
          { label: "All", filter: "all" },
          { label: "Most helpful", filter: "helpful" },
          { label: "Highest rating", filter: "5" },
          { label: "Lowest rating", filter: "4" },
          { label: "Review with photo", filter: "3" },
          { label: "2 Stars", filter: "2" },
          { label: "1 Star", filter: "1" },
        ].map((button) => (
          <TouchableOpacity
            key={button.filter}
            style={styles.filterButton}
            onPress={() => onFilterReviews(button.filter)}
          >
            <Text style={styles.filterButtonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView>
        {isLoading ? (
          <WidgetLoading />
        ) : (
          <>
            {visibleReviews.map((review, index) => (
              <View key={review.review_id || index}>
                {renderReview({ item: review })}
              </View>
            ))}
            {visibleCount <
              (filteredReviews.length > 0
                ? filteredReviews.length
                : reviews.length) && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreReviews}
              >
                <Text style={styles.loadMoreButtonText}>Load more reviews</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    borderColor: "#e5e5e5",
    justifyContent: "center",
    paddingVertical: 20,
  },
  statsContainer: {
    marginBottom: 16,
  },
  averageReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  averageReview: {
    fontSize: 50,
    fontWeight: "500",
    textAlign: "center",
  },
  starIcon: {
    marginLeft: 2,
  },
  totalReview: {
    textAlign: "center",
    fontSize: 20,
    color: Colors.blackColor,
    fontWeight: "500",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterOption: {
    flex: 1,
    alignItems: "center",
  },
  filterOptionText: {
    fontSize: 12,
    color: "#555",
  },
  filterDivider: {
    height: 1,
    width: "80%",
    backgroundColor: "#ccc",
    marginTop: 4,
  },
  imageReviewContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
  },
  allPhotos: {
    fontSize: 16,
    color: "#007BFF",
    textAlign: "right",
    marginLeft: 5,
  },
  imageScrollContainer: {
    marginVertical: 15,
  },
  imageBox: {
    marginRight: 10,
  },
  reviewImages: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  ratingOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "25%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  ratingText: {
    fontSize: 16,
    color: Colors.whiteColor,
    fontWeight: "500",
    marginRight: 5,
  },
  filterButtonsContainer: {
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  reviewContainer: {
    marginTop: 15,
    // padding: 16,
    // backgroundColor: "#f9f9f9",
    // borderRadius: 8,
  },
  reviewContainerTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    padding: 5,
  },
  likeCountText: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.blackColor,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.indicatorDefaultColor,
    marginHorizontal: 10,
  },
  reportButton: {
    padding: 8,
  },
  reportText: {
    fontSize: 16,
    color: Colors.darkTextColor,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "500",
  },
  reviewDateBox: {
    marginTop: 3,
    flexDirection: "row",
    gap: 3,
  },
  reviewDate: {
    fontSize: 14,
    color: "#555",
  },
  starContainer: {
    flexDirection: "row",
    gap: 3,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.blackColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "500",
  },
  mediaContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    // borderWidth: 1,
    borderRadius: 8,
  },
  replyReviewContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    padding: 10,
  },
  replyFrom: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blackColor,
  },
  replyText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  dividerReview: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 15,
  },
  titleReviewCard: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleReviewCard: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  loadMoreButton: {
    marginVertical: 20,
    width: "45%",
    padding: 10,
    backgroundColor: Colors.whiteBgColor,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    alignSelf: "flex-end",
  },
  loadMoreButtonText: {
    color: Colors.blackColor,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ProductReviewWidget;
