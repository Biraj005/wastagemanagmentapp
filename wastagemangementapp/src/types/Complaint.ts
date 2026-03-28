
export enum ComplaintStatus {
  PENDING = 'PENDING',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
}
export interface IComplaint {
  id: number;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

/*
@Data
public class ComplaintRequestDto {
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull(message = "Latitude is required")
    private Double latitude;
    @NotNull(message = "Longitude is required")
    private Double longitude;
    @NotBlank(message = "District is required")
    private  String district;



    public class ComlaintRespionseDto {
    private Long id;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Status status;
    private Long  user_id;
    private String district_id;
}
 */
export interface ComplaintError{
   description?:string,
   location?:string,
   image?:string
}
