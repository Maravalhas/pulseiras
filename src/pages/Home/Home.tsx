import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getAllOrders } from "../../axios/orders";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { getProductFinalPrice } from "../../utilities/helpers";

const Home = () => {
  const [ordersData, setOrdersData] = useState<any>();

  const months = useMemo(() => {
    const current = moment().month() + 1;

    return moment
      .monthsShort()
      .map((month, index) => ({ month, index: index + 1 }))
      .sort((a, b) => {
        const a_final =
          a.index > current ? a.index - current - (a.index - current) : a.index;
        const b_final =
          b.index > current ? b.index - current - (b.index - current) : b.index;
        if (a_final < b_final) {
          return -1;
        }
        return 1;
      })
      .map((month) => ({ ...month, index: month.index - 1 }));
  }, []);

  useEffect(() => {
    getAllOrders({
      products: 1,
      date: moment().subtract(12, "months").format("YYYY-MM-DD"),
    }).then((res) => {
      setOrdersData(res.data);
    });
  }, []);

  const monthsOrders = useMemo(() => {
    let months: any = {};

    ordersData?.data?.forEach((order: any) => {
      const month = moment(order.createdAt).month();
      months[month] = months[month] ? [...months[month], order] : [order];
    });

    return months;
  }, [ordersData]);

  const ordersChart = useMemo(() => {
    return {
      series: [
        {
          name: "Encomendas",
          data: months.map(({ index }) => monthsOrders[index]?.length || 0),
        },
      ],
      options: {
        xaxis: {
          categories: months.map((month) => month.month),
        },
        title: { text: "Encomendas" },
        chart: {
          toolbar: {
            show: false,
          },
        },
      },
    };
  }, [monthsOrders]);

  const productsChart = useMemo(() => {
    return {
      series: [
        {
          name: "Produtos Vendidos",
          data: months.map(({ index }) => {
            return (
              monthsOrders[index]?.reduce(
                (acc: number, order: any) =>
                  acc +
                  order.OrdersProducts.reduce(
                    (acc: number, product: any) => acc + product.quantity,
                    0
                  ),
                0
              ) || 0
            );
          }),
        },
      ],
      options: {
        xaxis: {
          categories: months.map((month) => month.month),
        },
        title: { text: "Produtos vendidos" },
        chart: {
          toolbar: {
            show: false,
          },
        },
      },
    };
  }, [monthsOrders]);

  const incomeChart = useMemo(() => {
    return {
      series: [
        {
          name: "Receitas",
          data: months.map(({ index }) => {
            return (
              monthsOrders[index]?.reduce(
                (acc: number, order: any) =>
                  acc +
                  order.OrdersProducts.reduce(
                    (acc: number, product: any) =>
                      acc + getProductFinalPrice(product),
                    0
                  ),
                0
              ) || 0
            );
          }),
        },
      ],
      options: {
        xaxis: {
          categories: months.map((month) => month.month),
        },
        title: { text: "Receitas (€)" },
        chart: {
          toolbar: {
            show: false,
          },
        },
      },
    };
  }, [monthsOrders]);

  const productsTypeChart = useMemo(() => {
    let products: any = {};

    ordersData?.data?.forEach((order: any) => {
      order.OrdersProducts?.forEach((product: any) => {
        if (products[product.id_product]) {
          products[product.id_product].quantity += product.quantity;
        } else {
          products[product.id_product] = {
            name: product.name,
            quantity: product.quantity,
          };
        }
      });
    });

    const data = Object.values(products).sort(
      (a: any, b: any) => b.quantity - a.quantity
    );

    return {
      series: data.map((product: any) => product.quantity),
      options: {
        labels: data.map(
          (product: any) => `${product.name}: ${product.quantity}`
        ),
        dataLabels: {
          formatter: function (_: any, config: any) {
            return config.w.config.series[config.seriesIndex];
          },
        },
        xaxis: {
          categories: months.map((month) => month.month),
        },
        title: { text: "Vendas / Produto" },
        chart: {
          toolbar: {
            show: false,
          },
        },
      },
    };
  }, [ordersData]);

  return (
    <>
      <Breadcrumb />
      <div className="card">
        <div className="card-header">
          <div className="card-title">Dashboards</div>
        </div>
        <div className="card-body p-0 mt-2 d-flex flex-wrap">
          <div className="col-12 col-lg-6 col-xl-4 p-2">
            <div className="card card-shadow p-2">
              <ReactApexChart
                options={ordersChart?.options}
                series={ordersChart?.series}
                type="line"
                height={400}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-4 p-2">
            <div className="card card-shadow p-2">
              <ReactApexChart
                options={productsChart?.options}
                series={productsChart?.series}
                type="line"
                height={400}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-4 p-2">
            <div className="card card-shadow p-2">
              <ReactApexChart
                options={incomeChart?.options}
                series={incomeChart?.series}
                type="line"
                height={400}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-4 p-2">
            <div className="card card-shadow p-2">
              <ReactApexChart
                options={productsTypeChart?.options}
                series={productsTypeChart?.series}
                type="pie"
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
