import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";

export default function Logo() {
  return (
    <div className="flex mt-20">
      <WbSunnyOutlinedIcon
        sx={{
          color: "#222222",
          fontSize: "4rem",
          marginLeft: "3rem",
          marginRight: "3rem",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      />
      <CloudOutlinedIcon
        sx={{
          color: "#222222",
          fontSize: "4rem",
          marginLeft: "3rem",
          marginRight: "3rem",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      />
      <AcUnitOutlinedIcon
        sx={{
          color: "#222222",
          fontSize: "4rem",
          marginLeft: "3rem",
          marginRight: "3rem",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      />
    </div>
  );
}
