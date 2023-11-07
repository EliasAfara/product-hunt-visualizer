import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_POSTS } from '../graphql.operations';
import { ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

const POSTS_PER_FETCH = 20;

interface Post {
  id: string;
  name: string;
  tagline: string;
  url: string;
  thumbnail: {
    url: string;
  };
  createdAt: string;
  topics: TopicConnection;
}

interface PostEdge {
  cursor: string;
  node: Post;
}

interface PostConnection {
  posts: {
    edges: PostEdge[];
    totalCount: number;
  };
}

interface Topic {
  id: string;
  name: string;
}

interface TopicEdge {
  node: Topic;
}

interface TopicConnection {
  edges: TopicEdge[];
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @ViewChild('chart')
  chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;

  posts: PostEdge[] = [];
  error: any;
  last_post: string = '';
  // Use type inference for variables
  variables =
    this.last_post.length > 0
      ? { first: POSTS_PER_FETCH, after: this.last_post }
      : { first: POSTS_PER_FETCH, after: '' };

  topics: Record<string, number> = {};

  isLoading: boolean = false;
  isFetchingData: boolean = false; // flag to track if a request is in progress

  // Toggle loading flag
  toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  // Fetch initial set of posts
  fetchPosts() {
    this.toggleLoading();
    this.apollo
      .watchQuery({
        query: GET_POSTS,
        variables: this.variables,
      })
      .valueChanges.subscribe(({ data, error }: any) => {
        // Update posts and error data
        this.posts = data.posts.edges;
        this.error = error;

        // Update the cursor for the next fetch
        this.last_post = data.posts.edges[data.posts.edges.length - 1].cursor;

        // Count the topics
        this.countTopics(data.posts.edges);

        // Complete the loading process
        this.toggleLoading();
      });
  }

  countTopics = (data: PostEdge[]) => {
    data.forEach((post) => {
      const topics = post.node.topics.edges;
      topics.forEach((topic) => {
        const topicName = topic.node.name;
        // If topicName is not in topics, add it and set it to 1 else increment it by 1
        this.topics[topicName] = this.topics[topicName]
          ? this.topics[topicName] + 1
          : 1;
      });
    });

    this.chartOptions.labels = Object.keys(this.topics);
    this.chartOptions.series = Object.values(this.topics);

    console.log(this.topics);
  };

  // Append more posts data when scrolling
  appendPostsData() {
    if (this.isFetchingData) {
      return; // If a request is already in progress, don't trigger another one
    }

    this.isFetchingData = true;
    this.toggleLoading();

    this.variables = { first: POSTS_PER_FETCH, after: this.last_post };
    this.apollo
      .watchQuery({
        query: GET_POSTS,
        variables: this.variables,
      })
      .valueChanges.subscribe(({ data, error }: any) => {
        // Append new data to existing posts
        this.posts = [...this.posts, ...data.posts.edges];
        this.error = error;

        // Update the cursor for the next fetch
        this.last_post = data.posts.edges[data.posts.edges.length - 1].cursor;

        // Count the topics
        this.countTopics(this.posts);

        // Complete the loading process
        this.toggleLoading();
        this.isFetchingData = false; // Reset the flag
      });
  }

  // Handle the scroll event
  onScroll() {
    this.appendPostsData();
  }

  constructor(private apollo: Apollo) {
    this.chartOptions = {
      series: [],
      chart: {
        width: 400,
        type: 'donut',
      },
      labels: [],
      responsive: [
        {
          breakpoint: 2500,
          options: {
            chart: {
              width: 700,
            },
            legend: {
              position: 'right',
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: 'Total Topics Count',
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w: { globals: { seriesTotals: any[] } }) {
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
  }

  ngOnInit(): void {
    // Initial data fetch
    this.fetchPosts();
  }
}
